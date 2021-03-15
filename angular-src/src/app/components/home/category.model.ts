export class Category {
  public title: string;
  public title_dashed: string;
  public img_path: string;
  public subtitle: string;
  public description: string;

  constructor();

  constructor(title?: string, title_dashed?: string, img_path?: string, subtitle?: string, description?: string){
    this.title = title;
    this.title_dashed = title_dashed;
    this.img_path = img_path;
    this.subtitle = subtitle;
    this.description = description;
  }
}
