"use client";

import type { UserPagesDict } from "@/shared/i18n";

import { CookingRecordBoardState } from "./CookingRecordBoardState";

type CookingRecordPageStatusProps = {
  isAuthReady: boolean;
  authGate: boolean;
  isPending: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  shouldFetchNext: boolean;
  hasRecords: boolean;
  sentinelRef: (node?: Element | null) => void;
  copy: UserPagesDict["calendar"]["cookingRecord"]["state"];
  onRetry: () => void;
  onLogin: () => void;
};

export const CookingRecordPageStatus = (
  props: CookingRecordPageStatusProps
) => {
  if (!props.isAuthReady) {
    return (
      <CookingRecordBoardState kind="loading" message={props.copy.loading} />
    );
  }
  if (!props.authGate) {
    return (
      <CookingRecordBoardState
        kind="login"
        title={props.copy.loginTitle}
        description={props.copy.loginDescription}
        actionLabel={props.copy.loginAction}
        onAction={props.onLogin}
      />
    );
  }
  if (props.isPending) {
    return (
      <CookingRecordBoardState kind="loading" message={props.copy.loading} />
    );
  }
  if (props.isError) {
    return (
      <CookingRecordBoardState
        kind="error"
        message={props.copy.error}
        actionLabel={props.copy.retry}
        onAction={props.onRetry}
      />
    );
  }
  if (props.shouldFetchNext || props.isFetchingNextPage) {
    return (
      <CookingRecordBoardState
        kind="loading-more"
        message={props.copy.loadingMore}
        sentinelRef={props.sentinelRef}
      />
    );
  }
  if (!props.hasRecords) {
    return (
      <CookingRecordBoardState
        kind="empty"
        title={props.copy.emptyTitle}
        description={props.copy.emptyDescription}
      />
    );
  }
  return null;
};
