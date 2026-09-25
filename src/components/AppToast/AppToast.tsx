import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Portal, Snackbar } from 'react-native-paper';

import { styles } from '@/components/AppToast/styles';
import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

type ToastApi = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  const show = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <Snackbar
          key={toast?.id}
          visible={toast != null}
          duration={5000}
          onDismiss={() => setToast(null)}
          style={[styles.snackbar, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <CustomText id="app-toast" variant="body">
            {toast?.message ?? ''}
          </CustomText>
        </Snackbar>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used within ThemeProvider');
  }
  return value;
}
