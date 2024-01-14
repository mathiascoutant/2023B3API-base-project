import { QueryFailedError } from 'typeorm';
import { BaseOptionException } from '../../autres/erreur';

export class ProjectNotFoundException extends BaseOptionException<'ProjectNotFoundException'> {
  constructor(error?: QueryFailedError) {
    super(error);
  }

  type = 'ProjectNotFoundException' as const;
}
export class ProjectUserNotFoundException extends BaseOptionException<'ProjectUserNotFoundException'> {
  constructor(error?: QueryFailedError) {
    super(error);
  }

  type = 'ProjectUserNotFoundException' as const;
}
