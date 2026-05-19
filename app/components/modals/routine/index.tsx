'use client'

import { ModalWrapper } from '../modal-wrapper'


export function RoutineCreateModal() {
  return (
    <ModalWrapper modalType="routine" title={'routine'}>
      <div className="flex flex-col gap-4">
        <button>create</button>
      </div>
    </ModalWrapper>
  )
}