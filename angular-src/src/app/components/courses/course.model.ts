import { Chapter } from  './chapter.model'

export class Course {
  public _id: string;
  public title: string;
  public title_dashed: string;
  public img_path: string;
  public subtitle: string;
  public description: string;
  public category: string;
  public level: number;
  public published_lectures_count: number;
  public chapters: Chapter[];
  public instructors: any[];
  public goals: string[];
  public prerequisite_courses: string[];

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
