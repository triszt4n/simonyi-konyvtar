// This needs to be done, because there's a bug with
// prisma exporting enums to frontend code
export enum orderstatus {
  PENDING = 'PENDING',
  RENTED = 'RENTED',
  LATE = 'LATE',
  RETURNED = 'RETURNED',
}

export enum userrole {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
  EDITOR = 'EDITOR',
}