/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
export enum DispatchStatusEnum {
  PENDING = 'pending',
  WAITING_DEPENDENCY = 'waiting_dependency',
  WAITING_CAPACITY = 'waiting_capacity',
  WAITING_BLOCKER = 'waiting_blocker',
  DISPATCHED = 'dispatched',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
