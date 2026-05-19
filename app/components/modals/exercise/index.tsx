'use client'

import { ModalWrapper } from '../modal-wrapper'


export function ExerciseCreateModal() {
  return (
    <ModalWrapper modalType="exercise" title={'exercise'}>
      <div className="flex flex-col gap-4">
        <button>create</button>
      </div>
    </ModalWrapper>
  )
}