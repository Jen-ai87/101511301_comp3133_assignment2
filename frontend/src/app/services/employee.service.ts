import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Employee } from '../models/employee.model';
import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '../graphql/operations';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .query<{ getAllEmployees: Employee[] }>({
        query: GET_ALL_EMPLOYEES,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.getAllEmployees));
  }

  searchEmployeeById(eid: string): Observable<Employee> {
    return this.apollo
      .query<{ searchEmployeeById: Employee }>({
        query: SEARCH_EMPLOYEE_BY_ID,
        variables: { eid },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.searchEmployeeById));
  }

  searchByDesignationOrDepartment(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
        query: SEARCH_EMPLOYEES,
        variables: { designation, department },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(input: Omit<Employee, '_id' | 'created_at' | 'updated_at'>): Observable<Employee> {
    return this.apollo
      .mutate<{ addEmployee: Employee }>({
        mutation: ADD_EMPLOYEE,
        variables: input,
      })
      .pipe(map((r) => r.data!.addEmployee));
  }

  updateEmployee(eid: string, input: Partial<Omit<Employee, '_id' | 'created_at' | 'updated_at'>>): Observable<Employee> {
    return this.apollo
      .mutate<{ updateEmployeeById: Employee }>({
        mutation: UPDATE_EMPLOYEE,
        variables: { eid, ...input },
      })
      .pipe(map((r) => r.data!.updateEmployeeById));
  }

  deleteEmployee(eid: string): Observable<Employee> {
    return this.apollo
      .mutate<{ deleteEmployeeById: Employee }>({
        mutation: DELETE_EMPLOYEE,
        variables: { eid },
      })
      .pipe(map((r) => r.data!.deleteEmployeeById));
  }
}
