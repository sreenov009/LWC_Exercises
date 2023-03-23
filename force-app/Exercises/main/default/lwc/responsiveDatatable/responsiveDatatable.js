import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class StudentBrowser extends NavigationMixin(LightningElement) {
	@api columnConfig;
	@api pkField;
	rows;
	_selectedRow; 

	set rowData(value) {
		if (typeof value !== "undefined") {
			this.rows = this.reformatRows(value);
		}
	}
	@api
	get rowData() {
		return this.rows;
	}

	handleRowDblClick (event) {
		const studentId = event.detail.pk;
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: studentId,
				objectApiName: 'Contact',
				actionName: 'edit'
			}
		});
	}

	highlightSelectedRow(target){
		if(this._selectedRow){
			this._selectedRow.classList.remove("slds-is-selected");
		}
		target.classList.add("slds-is-selected");
		this._selectedRow = target;
	}

	reformatRows = function(rowData) {
		let colItems = this.columnConfig;
		let reformattedRows = [];
	
		for (let i = 0; i < rowData.length; i++) {
			let rowDataItems = [];
			for (let j = 0; j < colItems.length; j++) {
				let colClass = '';
				if (colItems[j].hiddenOnMobile) {
					colClass = 'hiddenOnMobile';
				}
				rowDataItems.push({
					value: rowData[i][colItems[j].fieldName],
					label: colItems[j].label,
					type: colItems[j].type,
					class: colClass,
					columnId: 'col' + j + '-' + rowData[i][this.pkField],
					isPhone: (colItems[j].type==='phone'),
					isEmail: (colItems[j].type==='email'),
					isOther: (colItems[j].type!=='phone' && colItems[j].type!=='email')
				});
			}
			reformattedRows.push({
				data: rowDataItems,
				pk: rowData[i][this.pkField]
			});
		}
		return reformattedRows;
	}
	onRowClick(event) {
		const target = event.currentTarget;
		const evt = new CustomEvent( 'rowclick' , {
		detail: {
			pk: target.getAttribute('data-pk')
		}
		});
		this.dispatchEvent(evt);
		this.highlightSelectedRow(target);
		}
	onRowDblClick(event){
		const target = event.currentTarget;
		const evt = new CustomEvent('rowdblclick', {
			detail:{
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
	}

}