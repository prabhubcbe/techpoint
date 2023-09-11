import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  FilterpanelIsOpen = false;
  toppingsControl = new FormControl<string[]>([]); // Form control for toppings selection
  evaluation_DropdwonForm = new FormControl([]); // Form control for evaluation dropdown selection
  bankFilterCtrl = new FormControl(); // Form control for bank filter
  toppingList: string[] = [
    // Array of available toppings
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  evaluvation_datalist = [
    // Array of evaluation options
    {
      id: 1,
      name: 'Team leader',
    },
    {
      id: 2,
      name: 'Team member',
    },
    {
      id: 3,
      name: 'Software develop',
    },
  ];
  panelIsOpen: boolean = false;
  filteredToppingList: string[] = []; // Array of filtered toppings
  searchPanelIsOpen = false;
  allEmployeesData: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, public api: ServerService, private cdr: ChangeDetectorRef, private http: HttpClient) {
    this.bankFilterCtrl.valueChanges.subscribe((value) => {
      // Subscribe to value changes in bank filter control
      this.filteredToppingList = this.filterToppings(value); // Filter toppings based on the entered value
    });
    this.filteredToppingList = this.toppingList; // Initialize filtered toppings list with all toppings
    this.getAllEmployeesData();
  }
  ngOnInit(): void {}

  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[]; // Get the current selected toppings
    this.removeFirst(toppings, topping); // Remove the first occurrence of the topping
    this.toppingsControl.setValue(toppings); // Update the selected toppings
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove); // Find the index of the item to remove
    if (index !== -1) {
      array.splice(index, 1); // Remove the item from the array
    }
  }

  searchFilterLevel(event: any) {
    const filterValue = event.target.value.toLowerCase(); // Get the entered filter value
    this.bankFilterCtrl.setValue(filterValue); // Set the filter value in the form control
  }

  private filterToppings(value: string): string[] {
    if (!value) {
      return this.toppingList; // If no value provided, return all toppings
    }
    const filterText = value.toLowerCase(); // Convert the value to lowercase for case-insensitive comparison
    return this.toppingList.filter(
      (topping) => topping.toLowerCase().includes(filterText) // Filter toppings that include the filter text
    );
  }

  onRemoveEvalvationDropdown() {
    this.evaluation_DropdwonForm.setValue([]); // Clear the selected evaluation options
  }
  handleOpen() {
    this.panelIsOpen = !this.panelIsOpen;
  }

  // *************************Hide and show filter options*************************
  toggleFilter() {
    this.FilterpanelIsOpen = !this.FilterpanelIsOpen;
    this.searchPanelIsOpen = false;
  }
  toggleSearch() {
    this.searchPanelIsOpen = !this.searchPanelIsOpen;
    this.FilterpanelIsOpen = false;
  }
  // **************CANDIDATES PROFILE PAGE ROUTE****************
  getAllEmployeesData() {
    const obj = {
      "email": this.loginEmail,
      "orgCode": this.organizationCode,
      "organization": this.organizationName,
      "pageNo": 1,
      "pageSize": 5
    };

    this.api
      .getAllEmployeesData(obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.allEmployeesData = response.data;
          // Manually trigger change detection
          this.cdr.detectChanges();
          if (response.code === 200) {
            console.log('getAllEmployeesData', response.data);
            // Further operations with the response data can be performed here
          } else {
            console.error(
              'API error getAllEmployeesData: Unexpected status code:',
              response.success
            );
            // Handle the error here, for example, display an error message
          }
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
        },
      });
  }

  ngOnDestroy(): void {
    console.log('individual component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
