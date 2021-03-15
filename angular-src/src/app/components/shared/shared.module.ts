import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component';
import { ImagePreview } from '../../shared/image-preview.directive';

@NgModule({
  declarations: [
    LoadingComponent,
    ImagePreview
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    LoadingComponent,
    ImagePreview
  ]
})
export class SharedModule {}
