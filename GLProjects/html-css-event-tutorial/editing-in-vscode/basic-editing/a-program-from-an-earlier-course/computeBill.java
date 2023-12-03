package experiments2;

import java.text.DecimalFormat;
import java.util.Scanner;

public class computeBill {

	public static void main(String[] args) {
		DecimalFormat formatter = new DecimalFormat("#0.00");
		double tipAmount = 0.0;
		double taxAmount = 0.0;
		double tip = .165;
		double salesTax = .0855;

		Scanner myObj = new Scanner(System.in);
		System.out.print("Please enter the amount of the bill: \n");

		double billAmount = myObj.nextDouble();
		System.out.println("Your bill before calculation is: $" + formatter.format(billAmount) + "\n");

		tipAmount = billAmount * tip;
		taxAmount = billAmount * salesTax;
		double billTotalAmount = tipAmount + taxAmount + billAmount;
		System.out.println("Total tip is: $" + formatter.format(tipAmount) + "\nThe tax comes out to: $"
				+ formatter.format(taxAmount) + "\nThe grand total of the bill is: $"
				+ formatter.format(billTotalAmount));
	}

}
