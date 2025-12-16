'use client';
import clsx from 'clsx';

type ButtonType = {
  label?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  classes?: string;
  big?: boolean;
  border?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

type ButtonProps = {
  button: ButtonType;
};

export function Button({ button }: ButtonProps) {
  return (
    <button
      type={button.type ?? 'button'}
      disabled={button.disabled}
      className={clsx(
        'group relative flex items-center justify-center rounded-md duration-200 cursor-pointer ',
        {
          'px-4': button.label,
          'w-6 h-6 px-0': !button.label,
          'w-12 h-12 px-0': !button.label && button.big === true,
          'h-12': button.big === true,
          'border border-gray-600 border-solid hover:border-gray-500': button.border === true,
          'bg-primary-1 hover:bg-primary-1/50': button.border !== true,
        },
        `${button.classes}`
      )}
      onClick={button.onClick}>
      {button.icon}
      {button.label}
    </button>
  );
}
