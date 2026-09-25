import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dialog, Portal } from 'react-native-paper';

import { styles } from '@/components/AppDialog/styles';
import { CustomButton } from '@/components/CustomButton';
import { CustomText } from '@/components/CustomText';

type DialogOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type DialogApi = {
  alert: (options: DialogOptions) => Promise<void>;
  confirm: (options: DialogOptions) => Promise<boolean>;
};

type ActiveDialog = DialogOptions & {
  mode: 'alert' | 'confirm';
};

const DialogContext = createContext<DialogApi | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);

  const close = useCallback((confirmed: boolean) => {
    resolver.current?.(confirmed);
    resolver.current = null;
    setDialog(null);
  }, []);

  const open = useCallback((mode: ActiveDialog['mode'], options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setDialog({ ...options, mode });
    });
  }, []);

  const alert = useCallback(
    async (options: DialogOptions) => {
      await open('alert', options);
    },
    [open],
  );

  const confirm = useCallback(
    (options: DialogOptions) => open('confirm', options),
    [open],
  );
  const api = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Portal>
        <Dialog visible={dialog != null} onDismiss={() => close(false)} style={styles.dialog}>
          <Dialog.Title>{dialog?.title}</Dialog.Title>
          <Dialog.Content>
            <CustomText id="app-dialog-message" variant="body">
              {dialog?.message ?? ''}
            </CustomText>
          </Dialog.Content>
          <Dialog.Actions>
            {dialog?.mode === 'confirm' ? (
              <CustomButton
                id="app-dialog-cancel"
                label={dialog.cancelLabel ?? 'Cancel'}
                variant="link"
                onPress={() => close(false)}
              />
            ) : null}
            <CustomButton
              id="app-dialog-confirm"
              label={dialog?.confirmLabel ?? 'OK'}
              variant="link"
              onPress={() => close(true)}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error('useDialog must be used within ThemeProvider');
  }
  return value;
}
