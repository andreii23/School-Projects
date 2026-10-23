#include <iostream>
#include <string>
using namespace std;

string toLowerCase(string text) {
    for (int i = 0; i < text.length(); i++) {
        if (text[i] >= 'A' && text[i] <= 'Z') {
            text[i] = text[i] + 32;
        }
    }
    return text;
}


bool isValidISBN(string isbn) {
    string lowerISBN = toLowerCase(isbn);

    if (lowerISBN == "n/a") {
        return true;
    }

    int len = isbn.length();
    if (len != 10 && len != 13) {
        return false;
    }

    for (int i = 0; i < len; i++) {
        if (isbn[i] < '0' || isbn[i] > '9') {
            return false;
        }
    }
    return true;
}

int main() {
    const int MAX_BOOKS = 1000;

    string bookTitles[MAX_BOOKS];
    string bookAuthors[MAX_BOOKS];
    string bookISBNs[MAX_BOOKS];
    bool isAvailable[MAX_BOOKS];

    int bookCount = 0;
    int choice;

    string searchTitle, searchAuthor, searchISBN;

    while (true) {
        cout << "\n=================================================\n";
        cout << " --- LibrOnline : Where Libraries Go Digital --- \n";
        cout << "=================================================\n\n";
        cout << "1. Add New Book\n";
        cout << "2. Search Book by Title\n";
        cout << "3. Search Book by Author\n";
        cout << "4. Search Book by ISBN\n";
        cout << "5. Display All Available Books\n";
        cout << "6. Borrow Book\n";
        cout << "7. Return Book\n";
        cout << "8. Delete Book\n";
        cout << "9. Exit\n\n";
        cout << "Enter your choice: ";

        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(1000, '\n');
            cout << "\nInvalid input! Enter a number.\n";
            continue;
        }

        cin.ignore(1000, '\n');

        
        if (choice == 1) {
            if (bookCount >= MAX_BOOKS) {
                cout << "\nLibrary is full!\n";
            } else {
                cout << "Enter Book Title: ";
                getline(cin, bookTitles[bookCount]);

                cout << "Enter Author Name: ";
                getline(cin, bookAuthors[bookCount]);

                do {
                    cout << "Enter ISBN (10 or 13 digits, or N/A if not available): ";
                    getline(cin, bookISBNs[bookCount]);

                    if (!isValidISBN(bookISBNs[bookCount])) {
                        cout << "Invalid ISBN! Enter 10/13 digits or N/A only.\n";
                    }
                } while (!isValidISBN(bookISBNs[bookCount]));

                isAvailable[bookCount] = true;
                bookCount++;

                cout << "\nBook added successfully!\n";
            }
        }

        
        else if (choice == 2) {
            cout << "Enter Book Title: ";
            getline(cin, searchTitle);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (toLowerCase(bookTitles[i]) == toLowerCase(searchTitle)) {
                    cout << "\nTitle: " << bookTitles[i];
                    cout << "\nAuthor: " << bookAuthors[i];
                    cout << "\nISBN: " << bookISBNs[i];
                    cout << "\nStatus: " << (isAvailable[i] ? "Available" : "Borrowed") << endl;
                    found = true;
                    break;
                }
            }
            if (!found) cout << "\nBook not found!\n";
        }

        
        else if (choice == 3) {
            cout << "Enter Author Name: ";
            getline(cin, searchAuthor);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (toLowerCase(bookAuthors[i]) == toLowerCase(searchAuthor)) {
                    cout << "\nTitle: " << bookTitles[i];
                    cout << "\nISBN: " << bookISBNs[i];
                    cout << "\nStatus: " << (isAvailable[i] ? "Available" : "Borrowed") << endl;
                    found = true;
                }
            }
            if (!found) cout << "\nNo books found by this author!\n";
        }

        
        else if (choice == 4) {
            cout << "Enter ISBN: ";
            getline(cin, searchISBN);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (bookISBNs[i] == searchISBN) {
                    cout << "\nTitle: " << bookTitles[i];
                    cout << "\nAuthor: " << bookAuthors[i];
                    cout << "\nStatus: " << (isAvailable[i] ? "Available" : "Borrowed") << endl;
                    found = true;
                    break;
                }
            }
            if (!found) cout << "\nBook not found!\n";
        }

        
        else if (choice == 5) {
            bool any = false;
            for (int i = 0; i < bookCount; i++) {
                if (isAvailable[i]) {
                    cout << "\nTitle: " << bookTitles[i];
                    cout << "\nAuthor: " << bookAuthors[i];
                    cout << "\nISBN: " << bookISBNs[i] << endl;
                    any = true;
                }
            }
            if (!any) cout << "\nNo available books!\n";
        }

        
        else if (choice == 6) {
            cout << "Enter Book Title: ";
            getline(cin, searchTitle);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (toLowerCase(bookTitles[i]) == toLowerCase(searchTitle)) {
                    found = true;
                    if (isAvailable[i]) {
                        isAvailable[i] = false;
                        cout << "\nBook borrowed successfully!\n";
                        cout << "⚠ Reminder: You only have 2 DAYS to return this book.\n";
                    } else {
                        cout << "\nBook already borrowed!\n";
                    }
                    break;
                }
            }
            if (!found) cout << "\nBook not found!\n";
        }

        
        else if (choice == 7) {
            cout << "Enter Book Title: ";
            getline(cin, searchTitle);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (toLowerCase(bookTitles[i]) == toLowerCase(searchTitle)) {
                    found = true;
                    if (!isAvailable[i]) {
                        isAvailable[i] = true;
                        cout << "\nBook returned successfully!\n";
                    } else {
                        cout << "\nBook was not borrowed!\n";
                    }
                    break;
                }
            }
            if (!found) cout << "\nBook not found!\n";
        }

        
        else if (choice == 8) {
            cout << "Enter Book Title: ";
            getline(cin, searchTitle);

            bool found = false;
            for (int i = 0; i < bookCount; i++) {
                if (toLowerCase(bookTitles[i]) == toLowerCase(searchTitle)) {
                    for (int j = i; j < bookCount - 1; j++) {
                        bookTitles[j] = bookTitles[j + 1];
                        bookAuthors[j] = bookAuthors[j + 1];
                        bookISBNs[j] = bookISBNs[j + 1];
                        isAvailable[j] = isAvailable[j + 1];
                    }
                    bookCount--;
                    cout << "\nBook deleted successfully!\n";
                    found = true;
                    break;
                }
            }
            if (!found) cout << "\nBook not found!\n";
        }

        
        else if (choice == 9) {
            cout << "\n Thank you for using LibrOnline!\n Enhancing Library Administration Through Digital Innovation.\n";
            break;
        }

        else {
            cout << "\nInvalid choice!\n";
        }
    }

    return 0;
}
