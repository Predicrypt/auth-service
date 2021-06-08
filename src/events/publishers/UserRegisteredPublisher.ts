import {
  PublisherAbstract,
  SubjectEnum,
  UserRegisteredEventInterface,
} from '@Predicrypt/common';

export class UserRegisteredPublisher extends PublisherAbstract<UserRegisteredEventInterface> {
  subject: SubjectEnum.UserRegistered = SubjectEnum.UserRegistered;
}
