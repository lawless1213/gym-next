"use client";

import { IconAlertCircleFilled, IconCheck, IconExclamationCircleFilled, IconInfoCircleFilled, IconLoader } from "@tabler/icons-react";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster({ ...props }: ToasterProps) {
  return (
    <>
      <SonnerToaster
        richColors
        icons={{
          success: <IconCheck />,
          info: <IconInfoCircleFilled />,
          warning: <IconAlertCircleFilled />,
          error: <IconExclamationCircleFilled />,
          loading: <IconLoader />,
        }}
        toastOptions={{
          style: {
            bottom: '40px',
          },
          
          classNames: {
            toast: "bg-secondary! rounded-md p-2 flex gap-2 border-none! b-10",
            closeButton: "bg-secondary! border-0!",
          },
          closeButton: true,
  
        }}
        {...props}
      />
    </>
  );
}
