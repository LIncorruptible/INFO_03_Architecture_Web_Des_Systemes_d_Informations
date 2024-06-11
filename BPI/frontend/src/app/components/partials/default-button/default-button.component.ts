import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COLORS } from '../../../shared/constants/colors';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.css'
})
export class DefaultButtonComponent {
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() text: string = 'Submit';
  @Input() bgColor = COLORS.UI.BLUE;
  @Input() color = 'white';
  @Input() fontSizeRem = 1.3;
  @Input() widthRem = 12;

  @Output() onClick = new EventEmitter();
}
