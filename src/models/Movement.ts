import { MovementType } from "./MovementType";
import { Customer } from "./Customer";

export class Movement_s{
    movement:Movement;
    customer:Customer;
    movement_type:MovementType;
    movement_lines:Movement_Lines[];
}

export class Movement{
    id:number;
    company_id:number;
    customer_id:number;
    movement_type_id:number;
    ref_id:number;
    date:Date;
    price:Number;
    tax:Number;
    totalprice:Number;
    note:string;
}

export class Movement_Lines{
    id:number;
    master_id:number;
    vat:number;
    name:string;
    quantity:number;
    price:number;
    tax:number;
    totalprice:Number;
}

export class Movement_List{
    movement:Movement;
    customer_name:string;
    movement_type_name:string;
    movement_type_plus:string;
}
