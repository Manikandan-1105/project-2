import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Billingitems, BillingitemsRelations} from '../models';

export class BillingitemsRepository extends DefaultCrudRepository<
  Billingitems,
  typeof Billingitems.prototype.id,
  BillingitemsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Billingitems, dataSource);
  }
}
