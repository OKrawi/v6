import { Response } from './response.model'

export class Question {
  public _id: string;
  public title: string;
  public body: string;
  public user: any;
  // public user: {
  //   username: string,
  //   avatar_path: string
  // };
  public lecture_id: string;
  public top_response_id: string;
  public responses_count: number;
  public responses: Response[];
  public followers: string[];
  public voters: string[];
  public voters_count: number;

  constructor(){}

  // constructor(_id?: string, title?: string, body?: string, user_id?: string){
  //   this._id = _id;
  //   this.title = title;
  //   this.body = body;
  //   this.user_id = user_id;
  // }
}
