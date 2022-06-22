import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  periodoList = ["Manhã", "Tarde", "Integral"];
  studentForm !: FormGroup;
  actionBtn : string = "Salvar";
  constructor(private formBuilder : FormBuilder, 
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      nome : ['', Validators.required],
      nacionalidade : ['', Validators.required],
      ensino : ['', Validators.required],
      periodo : ['', Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Atualizar";
      this.studentForm.controls['nome'].setValue(this.editData.nome);
      this.studentForm.controls['nacionalidade'].setValue(this.editData.nacionalidade);
      this.studentForm.controls['ensino'].setValue(this.editData.ensino);
      this.studentForm.controls['periodo'].setValue(this.editData.periodo);
    }
  }
  addStudent(){
    if(!this.editData){
      if(this.studentForm.valid){
        this.api.postStudent(this.studentForm.value)
        .subscribe({
          next:(res)=>{
            alert("Estudante adicionado com sucesso!!!");
            this.studentForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Erro ao adicionar estudante")
          }
        })
      }
    }else{
      this.updateStudent()
    }
  }
  updateStudent(){
    this.api.putStudent(this.studentForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Estudante atualizado com sucesso!!!");
        this.studentForm.reset();
        this.dialogRef.close('atualizar');
      },
      error:()=>{
        alert("Erro ao atualizar estudante");
      }
    })
  }
}