"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <AlertOctagon className="size-7" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              An unexpected error occurred while rendering this page. Please refresh the page to try again.
            </p>

            <div className="mt-6 flex justify-center">
              <Button onClick={this.handleReload} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
