import { Comment } from './comment.model';

export class Announcement {
  public _id: string;
  public title: string;
  public body: string;
  public user: any;
  public comments: Comment[];

  constructor(){}

  // constructor(_id?: string, title?: string, body?: string, user_id?: string){
  //   this._id = _id;
  //   this.title = title;
  //   this.body = body;
  //   this.user_id = user_id;
  // }
}
