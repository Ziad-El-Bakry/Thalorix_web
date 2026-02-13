import type { HTMLAttributes } from "react";

export function Dialog(props: HTMLAttributes<HTMLDialogElement>) {
  return <dialog {...props} />;
}
