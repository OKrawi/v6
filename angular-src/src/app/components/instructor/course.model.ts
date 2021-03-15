export class Course {

  public _id: string;
  public title: string;
  public title_dashed: string;
  public img_path: string;
  public subtitle: string;
  public description: string;
  public category: string;
  public category_title_dashed: string;
  public level: number;
  public total_lectures_count: number;
  public published_lectures_count: number;
  public enrolled_students_count: number;
  public prerequisites: string[];
  public goals: string[];
  public isPublished: boolean;

  constructor(){}

  // constructor(
  //   _id?: string,
  //   title?: string, title_dashed?: string, img_path?: string,
  //   subtitle?: string, description?: string, level?: number){
  //   this._id = _id;
  //   this.title = title;
  //   this.title_dashed = title_dashed;
  //   this.img_path = img_path;
  //   this.subtitle = subtitle;
  //   this.description = description;
  //   this.level = level;
  // }
}
