export interface ItemProps {
  id?: string;
  name:string;
  price:number;
  dateOfProduction:Date;
  isGlutenFree:boolean;
  photo?:string;
  photoPath?:string;
  location?:{
    lat:number;
    lng:number;
  }
}
