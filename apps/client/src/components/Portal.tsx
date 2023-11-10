import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
    const ref = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window != "undefined" && window.document) {
            if (mounted) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "unset";
            }
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mounted]);

    useEffect(() => {
        ref.current = document.querySelector<HTMLElement>("#portal");
        setMounted(true);
    }, []);

    return mounted && ref.current
        ? createPortal(
              <>
                  <div className="fixed inset-0 z-40 bg-black/50"></div>
                  <div className="fixed inset-0 z-50 flex max-h-screen items-center justify-center backdrop-blur">
                      {children}
                  </div>
              </>,
              ref.current,
          )
        : null;
};
