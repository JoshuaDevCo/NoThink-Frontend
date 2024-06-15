export interface INotificationContext {
  toggle: () => void;
  append: (notification: Notification) => void;
  notifications: Notification[];
}

export type Notification = {
  type: "bot" | "challange" | "invited";
  label: string;
  text: string;
};
