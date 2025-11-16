export interface BackendItemProps {
    id?: string;
    name:string;
    price:number;
    date_of_production:Date;
    is_gluten_free:boolean;
    photo?:string;
    photoPath?:string;
    location?:{
        lat:number;
        lng:number;
    };
}
