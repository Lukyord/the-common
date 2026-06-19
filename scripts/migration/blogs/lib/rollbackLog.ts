import {
  appendRollbackLog as appendRollbackLogShared,
  getPendingRollbackEntries,
  loadRollbackLog as loadRollbackLogShared,
  saveRollbackLog as saveRollbackLogShared,
  type RollbackLog,
  type RollbackLogEntry,
} from '../../lib/rollback/rollbackLog.js'
import { ROLLBACK_LOG_PATH } from './reportPaths.js'

export type { RollbackLog, RollbackLogEntry }

export const loadRollbackLog = () => loadRollbackLogShared(ROLLBACK_LOG_PATH)

export const saveRollbackLog = (log: RollbackLog) => saveRollbackLogShared(ROLLBACK_LOG_PATH, log)

export const appendRollbackLog = (entry: Omit<RollbackLogEntry, 'migratedAt'>) =>
  appendRollbackLogShared(ROLLBACK_LOG_PATH, entry)

export { getPendingRollbackEntries }
