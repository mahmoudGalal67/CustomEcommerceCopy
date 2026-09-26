"use client";

import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LaravelErrorPopupProps {
  error: any;
}

export default function LaravelErrorPopup({ error }: LaravelErrorPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  if (!error) return null;

  /*
   * RTK Query errors can look like:
   *
   * {
   *   status: 500,
   *   data: {
   *     message: "SQLSTATE..."
   *   }
   * }
   */

  const payload = error?.data ?? error;

  const message =
    payload?.message ||
    error?.error ||
    "Something went wrong. Please try again.";

  const errors = payload?.errors;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{ duration: 0.25 }}
            className="
                            fixed left-1/2 top-1/2 z-101
                            w-[90%] max-w-lg
                            -translate-x-1/2 -translate-y-1/2
                            overflow-hidden
                            rounded-2xl
                            border border-destructive/30
                            bg-background
                            shadow-2xl
                        "
          >
            {/* Header */}
            <div className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error
                </h3>

                <p className="mt-2 wrap-break-word text-sm leading-6 text-muted-foreground">
                  {message}
                </p>

                {/* Validation errors */}
                {errors && (
                  <ul className="mt-4 space-y-2">
                    {Object.values(errors)
                      .flat()
                      .map((err: any, i) => (
                        <li
                          key={i}
                          className="rounded-lg bg-destructive/5 px-3 py-2 text-sm text-destructive"
                        >
                          {String(err)}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="h-8 w-8 shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t bg-muted/30 p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
