export interface ItemProps {
  id?: string;
  name:string;
  price:number;
  dateOfProduction:Date;
  isGlutenFree:boolean;
  photoUrl?:string;
  location?:{lat:number, lng:number};
}
