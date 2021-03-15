export class Report {

  public _id: string;
  public body: string;
  public course_title_dashed: string;
  public item_title: string;
  public item_body: string;

  public question_id: string;
  public response_id: string;
  public announcement_id: string;
  public comment_id: string;
  public abuseType: string;
  public created_at: string;
  public suspect: any;
  public resolved: boolean;
  public is_removed: boolean;
  public is_ignored: boolean;
  public suspect_banned: boolean;

  constructor(){}

  // constructor(
  //   title?: string, title_dashed?: string, img_path?: string,
  //   subtitle?: string, description?: string, level?: number){
  //   this.title = title;
  //   this.title_dashed = title_dashed;
  //   this.img_path = img_path;
  //   this.subtitle = subtitle;
  //   this.description = description;
  //   this.level = level;
  // }
}
