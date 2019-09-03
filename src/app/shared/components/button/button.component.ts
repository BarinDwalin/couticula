import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input()
  animated = false;
  @Input()
  color = 'light';
  @Input()
  disabled = false;
  @Input()
  name: string;
  @Input()
  size = 'small';
  @Input()
  transparent = false;
  @Output()
  clicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.clicked.emit();
  }
}
