/**
 * @description Omits `id`, `createdAt`, `updatedAt` from entity
 */
export type EntityAttributes<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * @description Makes entity properties optional, usually for the creation attributes type
 * @example
 * type Entity = { col1: number; col2: number | null };
 * const entity: EntityOptional<Entity, 'col2'> = { col1: number };
 */
export type EntityOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
