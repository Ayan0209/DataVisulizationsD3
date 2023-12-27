import pandas as pd

# Read the masterData.csv file into a DataFrame
df = pd.read_csv('masterData.csv')

# Filter the DataFrame to keep only rows with the 'Year' column equal to 2005
filtered_df = df[df['Year'] == 2005]

# Save the filtered data to a new CSV file
filtered_df.to_csv('masterData_2005.csv', index=False)
