export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null; // 注意
  completedDate?: Date; // 完了日付を追加
};
