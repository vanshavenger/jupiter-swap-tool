"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import { AccountChecker } from "../account/account-ui";
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-base-300 text-neutral-content shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <ul className="flex space-x-4 mb-4 md:mb-0">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className={`relative px-3 py-2 rounded-md transition-colors duration-200 ease-in-out
                      ${pathname === path || pathname.startsWith("/account/") ? "text-primary font-semibold" : "hover:text-primary"}
                      before:content-[''] before:absolute before:w-full before:h-0.5 before:bg-primary 
                      before:bottom-0 before:left-0 before:scale-x-0 before:transition-transform 
                      before:duration-300 hover:before:scale-x-100`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-4">
              <WalletButton />
              <ClusterUiSelect />
            </div>
          </div>
        </div>
      </nav>
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </main>
      <footer className="bg-base-300 text-base-content py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            By{" "}
            <Link
              className="relative inline-block text-primary transition-colors duration-200
                         before:content-[''] before:absolute before:w-full before:h-0.5 
                         before:bg-primary before:bottom-0 before:left-0 before:scale-x-0 
                         before:transition-transform before:duration-300 hover:before:scale-x-100"
              href="https://vansh.dsandev.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vansh Chopra
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="space-x-2">
            {submit && (
              <button
                className="btn btn-primary btn-sm md:btn-md transition-all duration-200 ease-in-out hover:scale-105"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            )}
            <button
              onClick={hide}
              className="btn btn-sm md:btn-md transition-all duration-200 ease-in-out hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-16 bg-base-200 rounded-lg shadow-md">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === "string" ? (
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="text-lg md:text-xl mb-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label="View Transaction"
          className="btn btn-sm btn-primary transition-all duration-200 ease-in-out hover:scale-105"
        />
      </div>,
      { duration: 5000 },
    );
  };
}
