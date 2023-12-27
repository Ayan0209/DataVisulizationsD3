import pandas as pd

# Load the countries_region CSV
countries_region = pd.read_csv('data/countries_regions.csv')

# Load the global_development CSV
global_development = pd.read_csv('data/global_development.csv')

# Merge the two dataframes based on the 'Country' and 'name' columns
merged_data = global_development.merge(countries_region, left_on='Country', right_on='name', how='left')

# Filter out rows with empty World Bank region after merging
merged_data = merged_data[merged_data['World bank region'].notna()]

# Define the columns you want to keep in the masterData
selected_columns = ['Country', 'Year', 'World bank region', 'BirthRate', 'DeathRate', 'LifeExpectancy', 'PopulationGrowth', 'TotalPopulation', 'MobileCellSubs', 'TelephoneLines', 'AgriculturalLand', 'RuralPopulation', 'RuralPopulationGrowth', 'SurfaceArea', 'UrbanPopulationPercent']

# Create the masterData dataframe with the selected columns
master_data = merged_data[selected_columns]

# Rename the columns as needed
master_data.rename(columns={'World bank region': 'Region'}, inplace=True)

# Save the masterData to a CSV file
master_data.to_csv('masterData.csv', index=False)
