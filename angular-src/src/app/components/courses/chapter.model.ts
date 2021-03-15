import { Lecture } from './lecture.model'

export class Chapter {
  public _id: string;
  public title: string;
  public lectures: Lecture[];

  constructor(){}

}
