import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  actionLabel = '확인',
  onAction,
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="오류">
      <p className="text-gray-700 mb-4">{errorMessage}</p>
      <Button onClick={handleAction} fullWidth>
        {actionLabel}
      </Button>
    </Modal>
  );
};
