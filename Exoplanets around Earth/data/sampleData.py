import csv
import random

def select_random_rows_within_distance(input_file, output_file, min_distance=850, max_distance=4000, num_rows=30):
    
    with open(input_file, 'r') as file:
        reader = csv.DictReader(file)
        rows = list(reader)   
    filtered_rows = [row for row in rows if row['distance'] and min_distance <= float(row['distance']) <= max_distance]

    num_rows = min(num_rows, len(filtered_rows))

    selected_rows = random.sample(filtered_rows, num_rows)

    with open(output_file, 'w', newline='') as file:
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()  
        writer.writerows(selected_rows)  

input_csv_file = 'data\cleaned_5250.csv'
output_csv_file = 'output.csv'
select_random_rows_within_distance(input_csv_file, output_csv_file, min_distance=850, max_distance=4000, num_rows=40)
