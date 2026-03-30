/* ============================================
   Warehouse Inventory Admin Interface
   JavaScript Logic
   ============================================ */

// State management
let inventoryData = [];
let isLoading = false;

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const tableContainer = document.getElementById('tableContainer');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const inventoryBody = document.getElementById('inventoryBody');
const refreshBtn = document.getElementById('refreshBtn');
const addNewBtn = document.getElementById('addNewBtn');
const addNewEmpty = document.getElementById('addNewEmpty');
const totalItemsDisplay = document.getElementById('totalItems');
const lowStockDisplay = document.getElementById('lowStockCount');
const statusMessage = document.getElementById('statusMessage');

// Modal elements
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');

/* ============================================
   Initialization
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    loadInventory();
    setupEventListeners();
});

/* ============================================
   Event Listeners
   ============================================ */

function setupEventListeners() {
    refreshBtn.addEventListener('click', loadInventory);
    addNewBtn.addEventListener('click', handleAddNew);
    addNewEmpty.addEventListener('click', handleAddNew);

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

/* ============================================
   Main Data Loading
   ============================================ */

async function loadInventory() {
    if (isLoading) return;

    isLoading = true;
    showLoading();

    try {
        const response = await fetch('/inventory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        inventoryData = await response.json();
        console.log('Inventory loaded:', inventoryData);

        if (inventoryData.length === 0) {
            showEmptyState();
        } else {
            renderInventoryTable();
            updateStatusBar();
            showTableContainer();
        }

        hideError();
    } catch (error) {
        console.error('Error loading inventory:', error);
        showError(`Failed to load inventory: ${error.message}`);
        showEmptyState();
    } finally {
        isLoading = false;
    }
}

/* ============================================
   Display Management
   ============================================ */

function showLoading() {
    loadingSpinner.style.display = 'flex';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'none';
    errorMessage.style.display = 'none';
}

function showTableContainer() {
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';
    errorMessage.style.display = 'none';
}

function showEmptyState() {
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'flex';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

/* ============================================
   Table Rendering
   ============================================ */

function renderInventoryTable() {
    inventoryBody.innerHTML = '';

    inventoryData.forEach((item) => {
        const row = createTableRow(item);
        inventoryBody.appendChild(row);
    });

    console.log(`Rendered ${inventoryData.length} items`);
}

function createTableRow(item) {
    const row = document.createElement('tr');
    
    // Determine stock status
    const stockStatus = getStockStatus(item.quantity_in_stock, item.min_stock_level);
    const statusClass = stockStatus.class;
    const statusLabel = stockStatus.label;

    // Format price as currency
    const formattedPrice = formatCurrency(item.unit_price);

    // Format dates
    const lastUpdated = formatDate(item.last_updated);

    row.innerHTML = `
        <td class="col-id"><strong>${item.product_id || 'N/A'}</strong></td>
        <td class="col-sku"><code>${escapeHtml(item.sku)}</code></td>
        <td class="col-name">${escapeHtml(item.product_name)}</td>
        <td class="col-category">${escapeHtml(item.category || 'N/A')}</td>
        <td class="col-quantity">
            <span class="status-badge ${statusClass}">
                ${item.quantity_in_stock}
            </span>
        </td>
        <td class="col-min-stock">${item.min_stock_level}</td>
        <td class="col-price" style="font-family: 'Courier New', monospace;">${formattedPrice}</td>
        <td class="col-supplier">${escapeHtml(item.supplier || 'N/A')}</td>
        <td class="col-location">${escapeHtml(item.location || 'N/A')}</td>
        <td class="col-updated">${lastUpdated}</td>
        <td class="col-actions">
            <div class="action-buttons">
                <button class="action-btn edit" title="Edit item (Coming soon)" data-id="${item.product_id}">Edit</button>
                <button class="action-btn delete" title="Delete item (Coming soon)" data-id="${item.product_id}">Delete</button>
            </div>
        </td>
    `;

    // Attach event listeners to action buttons
    const editBtn = row.querySelector('.action-btn.edit');
    const deleteBtn = row.querySelector('.action-btn.delete');

    editBtn.addEventListener('click', () => handleEdit(item));
    deleteBtn.addEventListener('click', () => handleDelete(item));

    return row;
}

/* ============================================
   Status Bar Updates
   ============================================ */

function updateStatusBar() {
    const totalItems = inventoryData.length;
    const lowStockItems = inventoryData.filter(
        item => item.quantity_in_stock <= item.min_stock_level
    ).length;

    totalItemsDisplay.innerHTML = `Total Items: <strong>${totalItems}</strong>`;
    lowStockDisplay.innerHTML = `Low Stock: <strong>${lowStockItems}</strong>`;

    // Update status message
    if (lowStockItems > 0) {
        statusMessage.textContent = `⚠️ ${lowStockItems} item(s) below minimum stock level`;
    } else {
        statusMessage.textContent = '✓ All items are adequately stocked';
    }
}

/* ============================================
   Action Handlers (Placeholders for Future Implementation)
   ============================================ */

function handleAddNew() {
    console.log('Add new item clicked - Implementation coming soon');
    // TODO: Implement add new item functionality
    // This will require creating a form in a modal and POST endpoint
    alert('Add item functionality is coming soon!');
}

function handleEdit(item) {
    console.log('Edit clicked for item:', item);
    // TODO: Implement edit functionality
    // This will require populating a form with item data and PUT endpoint
    alert(`Edit functionality for "${item.product_name}" is coming soon!`);
}

function handleDelete(item) {
    console.log('Delete clicked for item:', item);
    // TODO: Implement delete functionality
    // This will require a confirmation dialog and DELETE endpoint
    alert(`Delete functionality for "${item.product_name}" is coming soon!`);
}

/* ============================================
   Modal Management
   ============================================ */

function closeAllModals() {
    editModal.style.display = 'none';
    deleteModal.style.display = 'none';
}

/* ============================================
   Utility Functions
   ============================================ */

function getStockStatus(quantity, minLevel) {
    if (quantity < minLevel) {
        return {
            class: 'status-danger',
            label: 'CRITICAL'
        };
    } else if (quantity <= minLevel + 5) {
        return {
            class: 'status-warning',
            label: 'LOW'
        };
    } else {
        return {
            class: 'status-ok',
            label: 'OK'
        };
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/* ============================================
   Debugging & Monitoring
   ============================================ */

// Log application state for debugging
window.getAppState = () => ({
    inventoryData,
    isLoading,
    itemCount: inventoryData.length
});

console.log('Warehouse Inventory Admin Interface loaded');
console.log('Use getAppState() to inspect application state');
