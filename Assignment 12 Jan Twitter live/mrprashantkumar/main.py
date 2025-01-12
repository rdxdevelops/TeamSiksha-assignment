import json

def printDetailedResult(dictVal):
    for k, v in dictVal.items():
        print(f"{k}: {v}")

# Feature 1: **Get Event by Slug**: Retrieve an event by its slug.
def getEventBySlug():
    slug = input("Enter the slug you want Event for: ")
    for dicts in data:
        if dicts["slug"] == slug:
            printDetailedResult(dicts)
            return
    print("Slug not found!!")
    return

# Feature 2: **Search**: Implement search functionality by title or description.
def searchByTitleOrDesc():
    title = input("Enter the title or description you want to search: ")
    for dicts in data:
        if dicts["title"] == title or dicts["description"] == title:
            printDetailedResult(dicts)
            return

    print("Title/Description not found!!")
    return

# Feature 3: **Soft Delete Event**: Implement a soft delete feature for events.
def softDeleteEventForSlug():
    slug = input("Enter the slug you want to soft delete Event for: ")
    for dicts in data:
        if dicts["slug"] == slug:
            for keys in dicts:
                dicts[keys] = ""
            return "Operation Successful!!"
    return "Slug not found!!"

# Feature 4:  **Update Description**: Update the description of an event based on its slug.
def updateDescBySlug():
    slug = input("Enter the slug you want to update description for: ")
    desc = input("Enter description: ")
    for dicts in data:
        if dicts["slug"] == slug:
            dicts["description"] = desc
            return "Operation Successful!!"
    return "Slug not found!!"

with open("data.json", "r") as file:
    data = json.load(file)

    print("**** Available features ****")
    print("Enter 1 for - **Get Event by Slug**: Retrieve an event by its slug.")
    print("Enter 2 for - **Search**: Implement search functionality by title or description.")
    print("Enter 3 for - **Soft Delete Event**: Implement a soft delete feature for events.")
    print("Enter 4 for - **Update Description**: Update the description of an event based on its slug.")
    print("Enter anything else to EXIT!!!")

    while True:
        choice = input("Enter the operation you want to perform: ")
        if choice == "1":
            getEventBySlug()
        elif choice == "2":
            searchByTitleOrDesc()
        elif choice == "3":
            print(softDeleteEventForSlug())
        elif choice == "4":
            print(updateDescBySlug())
        else:
            break
