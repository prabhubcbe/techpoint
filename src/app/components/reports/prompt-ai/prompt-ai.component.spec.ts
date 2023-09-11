import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptAIComponent } from './prompt-ai.component';

describe('PromptAIComponent', () => {
  let component: PromptAIComponent;
  let fixture: ComponentFixture<PromptAIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptAIComponent]
    });
    fixture = TestBed.createComponent(PromptAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
