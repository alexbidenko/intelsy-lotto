import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { User } from '../schemas/user.schema';

type MemberType = {
  user: User;
  socketId: string;
};

@Injectable()
export class MemberService {
  memberSubject = new Subject<
    MemberType & { event: 'connected' | 'disconnected' }
  >();

  members: MemberType[] = [];

  addMember(member: MemberType) {
    if (!this.members.some((el) => el.user.id === member.user.id)) {
      this.memberSubject.next({ ...member, event: 'connected' });
    }

    this.members.push(member);
  }

  removeMember(socketId: string) {
    const member = this.members.find((el) => el.socketId === socketId);

    if (member) {
      this.members = this.members.filter((el) => el.socketId !== socketId);

      if (!this.members.some((el) => el.user.id === member.user.id)) {
        this.memberSubject.next({ ...member, event: 'disconnected' });
      }
    }
  }

  getMembers() {
    const map = new Map<number, User>();
    this.members.forEach(({ user }) => {
      map.set(user.id, user);
    });
    return [...map.values()];
  }
}
