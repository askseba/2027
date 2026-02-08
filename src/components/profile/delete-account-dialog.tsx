'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

export function DeleteAccountDialog() {
  const t = useTranslations('profile.danger');
  const [open, setOpen] = useState(false);

  const handleDeleteClick = () => {
    setOpen(false);
    toast.info(t('deleteNotReady'));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          className="text-danger-red hover:text-danger-red/80 hover:bg-danger-red/10"
        >
          {t('delete')}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-primary/5 bg-white dark:bg-surface-elevated p-6 shadow-elevation-3 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-2xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-start">
            <Dialog.Title className="text-lg font-bold text-text-primary">{t('deleteTitle')}</Dialog.Title>
            <Dialog.Description className="text-sm text-text-secondary">{t('deleteDesc')}</Dialog.Description>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="danger" onClick={handleDeleteClick}>
              {t('confirm')}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
