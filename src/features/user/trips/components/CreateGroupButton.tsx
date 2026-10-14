"use client"
import React, { useState } from 'react'
import { Plus } from 'lucide-react';
import ModalLayout from '../../../../components/Modal';
import CreateGroup from './CreateGroup';
interface CreateGroupButtonProps {
  onClick?: () => void;
}

const CreateGroupButton = ({ onClick }: CreateGroupButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-[#0f6e56] text-white px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-sm shrink-0"
      >
        <span>Create new group</span>
        <Plus className="w-4 h-4" />
      </button>
      {!onClick && modalOpen && (
        <ModalLayout isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Group">
          <CreateGroup onClose={() => setModalOpen(false)} />
        </ModalLayout>
      )}
    </>
  );
};

export default CreateGroupButton;