import type { Notification, NotificationType, RelatedType } from "./type";

type AssertFalse<Value extends false> = Value;
type AssertTrue<Value extends true> = Value;
type IsEqual<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false;

export type RecipeReviewNotificationTypeGate = AssertTrue<
  "RECIPE_REVIEW" extends NotificationType ? true : false
>;
export type RecipeReviewRelatedTypeGate = AssertFalse<
  "RECIPE_REVIEW" extends RelatedType ? true : false
>;
export type NotificationRelatedIdGate = AssertTrue<
  IsEqual<Notification["relatedId"], string>
>;
