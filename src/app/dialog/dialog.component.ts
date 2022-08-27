import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ApiService} from "../services/api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  categoryList = ["Fruit", "Vegitable", "Electronics"];
  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  action_btn : string = "Save";
  dialogBoxTitle : string = "Add Product Data";


  constructor(private FormBuilder : FormBuilder, @Inject(MAT_DIALOG_DATA) public editData : any, private  api : ApiService, private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.FormBuilder.group({
      productName : ['', Validators.required],
      Category : ['', Validators.required],
      date : ['', Validators.required],
      freshness : ['', Validators.required],
      price : ['', Validators.required],
      comment : ['', Validators.required]
    });

    if(this.editData){
      this.action_btn = "Update";
      this.dialogBoxTitle = "Update Product Data";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['Category'].setValue(this.editData.Category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }
  addProduct(){
    if(this.editData){
      this.updateProduct();
    } else {
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next : (res) =>{
            alert("Product added successfully");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error(){
            alert("Error while adding the product");
          }
        })
      }
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next : (res) =>{
        alert("Product Updated Successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error(){
        alert("Error while updating the product");
      }
    })
  }

}
