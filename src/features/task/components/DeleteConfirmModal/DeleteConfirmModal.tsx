import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { MESSAGES } from '@/constants/messages';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  targetId,
  onConfirm,
}) => {
  const [inputValue, setInputValue] = useState('');
  const isValid = inputValue === targetId;

  // Reset input when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      setInputValue('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={MESSAGES.TASK_DELETE_CONFIRM}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {MESSAGES.DELETE_INSTRUCTION(targetId)}
        </p>
        <Input
          id="delete-confirm"
          label="ID 입력"
          value={inputValue}
          onChange={setInputValue}
          placeholder={targetId}
        />
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={onClose} fullWidth>
            {MESSAGES.BUTTON_CANCEL}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            fullWidth
          >
            {MESSAGES.BUTTON_DELETE}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
